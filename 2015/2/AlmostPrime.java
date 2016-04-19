import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;

public class AlmostPrime {

    private static String DEFAULT_PATH = "/home/ils/Projects/sandbox/tuenti-challenge/2015/2/";

    private List<String> readLines(String inputFile) {
        try {
            return Files.readAllLines(Paths.get(inputFile), Charset.forName("UTF-8"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Long getFirstDivisor(long number) {
        for (long i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) {
                return i;
            }
        }
        return null;
    }

    private boolean isAlmostPrime(long number) {
        Long firstDivisor = getFirstDivisor(number);
        if (firstDivisor == null) {
            return false;
        }

        Long secondDivisor = getFirstDivisor(number / firstDivisor);
        return secondDivisor == null;
    }

    private void printAlmostPrime(long first, long last) {
        long almostPrimeNumbers = 0;
        for (long j = first; j <= last; j++) {
            if (isAlmostPrime(j)) {
                almostPrimeNumbers++;
            }
        }
        System.out.println(almostPrimeNumbers);
    }

    private void printSolution(String inputFile) {
        List<String> lines = readLines(inputFile);
        Iterator<String> it = lines.iterator();
        long numberOfCases = Long.parseLong(it.next());
        for (int i = 0; i < numberOfCases; i++) {
            String line = it.next();
            String[] splittedLine = line.split(" ");
            printAlmostPrime(Long.parseLong(splittedLine[0]), Long.parseLong(splittedLine[1]));
        }
    }

    public static void main(String[] args) {
        AlmostPrime buffer = new AlmostPrime();
        String inputFile = args.length > 0 ? args[0] : DEFAULT_PATH + "testInput";
        buffer.printSolution(inputFile);
    }
}
