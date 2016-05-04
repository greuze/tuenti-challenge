import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;

public class TeamLunch {

    private static String DEFAULT_PATH = "/home/ils/Projects/sandbox/tuenti-challenge/2016/1/";

    private List<String> readLines(String inputFile) {
        try {
            return Files.readAllLines(Paths.get(inputFile), Charset.forName("UTF-8"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void printSolution(String inputFile) {
        List<String> lines = readLines(inputFile);
        Iterator<String> it = lines.iterator();
        long numberOfCases = Long.parseLong(it.next());
        for (int i = 1; i <= numberOfCases; i++) {
            long currentDiners = Long.parseLong(it.next());
            long tables;
            if (currentDiners == 0L) {
                tables = 0L;
            } else if (currentDiners < 5) {
                tables = 1L;
            } else {
                tables = 1L + Double.valueOf(Math.ceil((currentDiners - 4) / 2.0)).longValue();
            }
            System.out.println("Case #" + i + ": " + tables);
        }
    }

    public static void main(String[] args) {
        TeamLunch lunch = new TeamLunch();
        String inputFile = args.length > 0 ? args[0] : DEFAULT_PATH + "testInput";
        lunch.printSolution(inputFile);
    }
}
